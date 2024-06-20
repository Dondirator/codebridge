import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from '../../../services/news/news.service';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.scss',
})
export class ArticleDetailComponent implements OnInit {
  article: any;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        const articleId = +id; // Преобразуем строку id в число
        this.newsService.getArticleById(articleId).subscribe(
          (data: any) => {
            this.article = data;
          },
          (error) => {
            console.error('Error fetching article:', error);
          }
        );
      }
    });
  }
}
