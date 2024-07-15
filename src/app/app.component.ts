import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';
import { BannerComponent } from './core/components/banner/banner.component';
import { MovieService } from './shared/services/movie.service';
import { MovieCarouselComponent } from './shared/components/movie-carousel/movie-carousel.component';
import { IVideoContent } from './shared/models/video-content.interface';
import { Observable, forkJoin, map } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule ,HeaderComponent,BannerComponent,MovieCarouselComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'netflix-clone';
  movieService = inject(MovieService)
  bannerDetails$ = new Observable<any>();
  bannerVideo$ = new Observable<any>();

  movies: IVideoContent[] = [];
  tvShows: IVideoContent[] = [];
  ratedMovies: IVideoContent[] = [];
  nowPlayingMovies: IVideoContent[] = [];
  popularMovies: IVideoContent[] = [];
  topRatedMovies: IVideoContent[] = [];
  upcomingMovies: IVideoContent[] = [];

  sources = [
    this.movieService.getMovies(),
    this.movieService.getTvShows(),
    this.movieService.getRatedMovies(),
    this.movieService.getNowPlayingMovies(),
    this.movieService.getUpcomingMovies(),
    this.movieService.getPopularMovies(),
    this.movieService.getTopRated()
  ];
  ngOnInit(): void {
    forkJoin(this.sources)
    .pipe(
      map(([movies, tvShows, ratedMovies, nowPlaying, upcoming, popular, topRated])=>{
        this.bannerDetails$ = this.movieService.getBannerDetail(movies.results[0].id)
        this.bannerVideo$ = this.movieService.getBannerVideo(movies.results[0].id)
        return{movies, tvShows, ratedMovies, nowPlaying, upcoming, popular, topRated}
      })
    ).subscribe((res:any)=>{
      this.movies = res.movies.results as IVideoContent[];
      this.tvShows = res.tvShows.results as IVideoContent[];
      this.ratedMovies = res.ratedMovies.results as IVideoContent[];
      this.nowPlayingMovies = res.nowPlaying.results as IVideoContent[];
      this.upcomingMovies = res.upcoming.results as IVideoContent[];
      this.popularMovies = res.popular.results as IVideoContent[];
      this.topRatedMovies = res.topRated.results as IVideoContent[];
    })
  }
}
