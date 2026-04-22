import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

import { PostApiService } from '../../core/services/post-api.service';
import { TaxonomyApiService } from '../../core/services/taxonomy-api.service';
import { Category, Tag } from '../../core/models/taxonomy.model';
import { CreatePostRequest } from '../../core/models/post-write.model';

@Component({
  selector: 'app-post-editor',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './post-editor.component.html',
})
export class PostEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private postsApi = inject(PostApiService);
  private taxonomyApi = inject(TaxonomyApiService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('editorHost') editorHost?: ElementRef<HTMLElement>;

  editor?: Editor;

  formLoading = true;
  saving = false;
  error: string | null = null;

  postId: string | null = null;
  isEdit = false;

  title = '';
  excerpt = '';
  featuredImageUrl = '';

  categories: Category[] = [];
  tags: Tag[] = [];
  selectedCategoryIds: string[] = [];
  selectedTagIds: string[] = [];

  categorySearch = '';
  tagSearch = '';

  private pendingInitialContent = '';
  private editorMounted = false;

  get filteredCategories(): Category[] {
    if (!this.categorySearch.trim()) return this.categories;
    const term = this.categorySearch.toLowerCase();
    return this.categories.filter(c => c.name.toLowerCase().includes(term));
  }

  get filteredTags(): Tag[] {
    if (!this.tagSearch.trim()) return this.tags;
    const term = this.tagSearch.toLowerCase();
    return this.tags.filter(t => t.name.toLowerCase().includes(term));
  }

  getSelectedCategoryNames(): string[] {
    return this.categories
      .filter(c => this.selectedCategoryIds.includes(c.categoryId))
      .map(c => c.name);
  }

  getSelectedTagNames(): string[] {
    return this.tags
      .filter(t => this.selectedTagIds.includes(t.tagId))
      .map(t => t.name);
  }

  removeCategory(categoryId: string): void {
    this.selectedCategoryIds = this.selectedCategoryIds.filter(id => id !== categoryId);
    this.cdr.detectChanges();
  }

  removeTag(tagId: string): void {
    this.selectedTagIds = this.selectedTagIds.filter(id => id !== tagId);
    this.cdr.detectChanges();
  }

  getCategoryIdByName(name: string): string {
    return this.categories.find(c => c.name === name)?.categoryId ?? '';
  }

  getTagIdByName(name: string): string {
    return this.tags.find(t => t.name === name)?.tagId ?? '';
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.error = 'Editor not available during server render.';
      this.formLoading = false;
      this.cdr.detectChanges();
      return;
    }

    this.taxonomyApi.getCategories().subscribe({
      next: (c) => {
        this.categories = c;
        this.cdr.detectChanges();
      },
    });

    this.taxonomyApi.getTags().subscribe({
      next: (t) => {
        this.tags = t;
        this.cdr.detectChanges();
      },
    });

    this.postId = sessionStorage.getItem('inkwell_edit_post_id');
    this.isEdit = !!this.postId;

    if (this.isEdit && this.postId) {
      this.postsApi.getForEdit(this.postId).subscribe({
        next: (p) => {
          this.title = p.title;
          this.excerpt = p.excerpt;
          this.featuredImageUrl = p.featuredImageUrl ?? '';
          this.selectedCategoryIds = p.categoryIds;
          this.selectedTagIds = p.tagIds;

          const content = p.content || '';
          if (this.editor) {
            this.editor.commands.setContent(content);
          } else {
            this.pendingInitialContent = content;
          }

          this.formLoading = false;
          this.cdr.detectChanges();
          this.tryMountEditor();
        },
        error: () => {
          this.formLoading = false;
          this.error = 'Failed to load post for editing. Go back to dashboard.';
          this.cdr.detectChanges();
        },
      });
    } else {
      this.formLoading = false;
      this.cdr.detectChanges();
    }
  }

  ngAfterViewInit(): void {
    this.tryMountEditor();
  }

  private tryMountEditor(): void {
    if (this.editorMounted) return;
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.editorHost?.nativeElement) return;

    this.editor = new Editor({
      element: this.editorHost.nativeElement,
      extensions: [
        StarterKit,
        Placeholder.configure({ placeholder: 'Write your post…' }),
      ],
      content: this.pendingInitialContent || '',
    });

    this.editorMounted = true;
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  back() {
    sessionStorage.removeItem('inkwell_edit_post_id');
    this.router.navigate(['/author/dashboard']);
  }

  private buildRequest(): CreatePostRequest {
    return {
      title: this.title,
      content: this.editor?.getHTML() ?? '',
      excerpt: this.excerpt || null,
      featuredImageUrl: this.featuredImageUrl || null,
      categoryIds: this.selectedCategoryIds,
      tagIds: this.selectedTagIds,
    };
  }

  toggleCategory(categoryId: string): void {
    const index = this.selectedCategoryIds.indexOf(categoryId);
    if (index === -1) {
      this.selectedCategoryIds = [...this.selectedCategoryIds, categoryId];
    } else {
      this.selectedCategoryIds = this.selectedCategoryIds.filter(id => id !== categoryId);
    }
    this.cdr.detectChanges();
  }

  toggleTag(tagId: string): void {
    const index = this.selectedTagIds.indexOf(tagId);
    if (index === -1) {
      this.selectedTagIds = [...this.selectedTagIds, tagId];
    } else {
      this.selectedTagIds = this.selectedTagIds.filter(id => id !== tagId);
    }
    this.cdr.detectChanges();
  }

  isCategorySelected(categoryId: string): boolean {
    return this.selectedCategoryIds.includes(categoryId);
  }

  isTagSelected(tagId: string): boolean {
    return this.selectedTagIds.includes(tagId);
  }

  saveDraft() {
    this.error = null;
    const req = this.buildRequest();
    this.saving = true;
    this.cdr.detectChanges();

    if (!this.isEdit) {
      this.postsApi.createPost(req).subscribe({
        next: () => {
          this.saving = false;
          this.cdr.detectChanges();
          this.back();
        },
        error: (e) => {
          this.saving = false;
          this.error = e?.error ?? 'Save failed.';
          this.cdr.detectChanges();
        },
      });
      return;
    }

    this.postsApi.updatePost(this.postId!, req).subscribe({
      next: () => {
        this.saving = false;
        this.cdr.detectChanges();
        this.back();
      },
      error: (e) => {
        this.saving = false;
        this.error = e?.error ?? 'Update failed.';
        this.cdr.detectChanges();
      },
    });
  }

  publish() {
    this.error = null;
    const req = this.buildRequest();
    this.saving = true;
    this.cdr.detectChanges();

    const afterSave = (postId: string) => {
      this.postsApi.publish(postId).subscribe({
        next: () => {
          this.saving = false;
          this.cdr.detectChanges();
          this.back();
        },
        error: (e) => {
          this.saving = false;
          this.error = e?.error ?? 'Publish failed.';
          this.cdr.detectChanges();
        },
      });
    };

    if (!this.isEdit) {
      this.postsApi.createPost(req).subscribe({
        next: (p) => afterSave(p.postId),
        error: (e) => {
          this.saving = false;
          this.error = e?.error ?? 'Save failed.';
          this.cdr.detectChanges();
        },
      });
    } else {
      this.postsApi.updatePost(this.postId!, req).subscribe({
        next: (p) => afterSave(p.postId),
        error: (e) => {
          this.saving = false;
          this.error = e?.error ?? 'Update failed.';
          this.cdr.detectChanges();
        },
      });
    }
  }

  unpublish() {
    if (!this.postId) return;

    this.saving = true;
    this.cdr.detectChanges();

    this.postsApi.unpublish(this.postId).subscribe({
      next: () => {
        this.saving = false;
        this.cdr.detectChanges();
        this.back();
      },
      error: (e) => {
        this.saving = false;
        this.error = e?.error ?? 'Unpublish failed.';
        this.cdr.detectChanges();
      },
    });
  }

  delete() {
    if (!this.postId) return;
    if (!confirm('Delete this post?')) return;

    this.saving = true;
    this.cdr.detectChanges();

    this.postsApi.delete(this.postId).subscribe({
      next: () => {
        this.saving = false;
        this.cdr.detectChanges();
        this.back();
      },
      error: (e) => {
        this.saving = false;
        this.error = e?.error ?? 'Delete failed.';
        this.cdr.detectChanges();
      },
    });
  }

  toggleBold() {
    this.editor?.chain().focus().toggleBold().run();
  }

  toggleItalic() {
    this.editor?.chain().focus().toggleItalic().run();
  }

  toggleBullets() {
    this.editor?.chain().focus().toggleBulletList().run();
  }

  toggleOrdered() {
    this.editor?.chain().focus().toggleOrderedList().run();
  }
}
