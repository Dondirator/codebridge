import { Component, OnDestroy, OnInit } from '@angular/core';
import { NewsService } from '../../services/news/news.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss',
})
export class ArticlesComponent implements OnInit, OnDestroy {
  articles: any[] = [];
  filteredArticles: any[] = [];
  searchTerm: string = '';

  private subscription: Subscription;

  constructor(
    private newsService: NewsService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.subscription = this.newsService
      .getArticles()
      .subscribe((data: any) => {
        this.articles = data.results;
        this.filteredArticles = this.articles; // Initially show all articles
      });
  }

  onSearchInput() {
    this.searchArticles(this.searchTerm);
  }

  searchArticles(searchTerm: string) {
    if (!this.searchTerm.trim()) {
      this.filteredArticles = this.articles;
      return;
    }

    const keywords = this.searchTerm
      .toLowerCase()
      .split(' ')
      .filter((keyword) => keyword);
    this.filteredArticles = this.articles.filter((article) => {
      const titleMatches = keywords.some((keyword) =>
        article.title.toLowerCase().includes(keyword)
      );
      const summaryMatches = keywords.some((keyword) =>
        article.summary.toLowerCase().includes(keyword)
      );
      return titleMatches || summaryMatches;
    });

    // Sorting: articles with title matches first
    this.filteredArticles.sort((a, b) => {
      const aTitleMatches = keywords.some((keyword) =>
        a.title.toLowerCase().includes(keyword)
      );
      const bTitleMatches = keywords.some((keyword) =>
        b.title.toLowerCase().includes(keyword)
      );
      if (aTitleMatches && !bTitleMatches) return -1;
      if (!aTitleMatches && bTitleMatches) return 1;
      return 0;
    });
  }

  highlightKeywords(text: string): SafeHtml {
    if (!this.searchTerm.trim()) return text;

    const keywords = this.searchTerm.split(' ').filter((keyword) => keyword);
    keywords.forEach((keyword) => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      text = text.replace(
        regex,
        `<span style="background-color: yellow;">$1</span>`
      );
    });

    return this.sanitizer.bypassSecurityTrustHtml(text);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
