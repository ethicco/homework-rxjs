import { Injectable } from '@nestjs/common';
import {
  firstValueFrom,
  toArray,
  from,
  map,
  mergeAll,
  take,
  Observable,
} from 'rxjs';
import axios from 'axios';

@Injectable()
export class RxjsService {
  private readonly githubURL = 'https://api.github.com/search/repositories?q=';
  private readonly gitlabURL = 'https://gitlab.com/api/v4/projects?search=';

  private getGithub(text: string, count: number): Observable<any> {
    return from(axios.get(`${this.githubURL}${text}`))
      .pipe(
        map((res: any) => res.data.items),
        mergeAll(),
      )
      .pipe(take(count));
  }

  private getGitlab(text: string, count: number): Observable<unknown> {
    return from(axios.get(`${this.gitlabURL}${text}`))
      .pipe(
        map((res: any) => res.data.items),
        mergeAll(),
      )
      .pipe(take(count));
  }

  async searchRepositoriesGithub(
    text: string,
    hub: 'github' | 'gitlab',
  ): Promise<any> {
    // Здесь можно добавить логику проверки на какой hub делать запрос
    console.log('hub = ', hub);

    let data$: Observable<any>;

    if (hub === 'github') {
      data$ = this.getGithub(text, 10).pipe(toArray());
    } else {
      data$ = this.getGitlab(text, 10).pipe(toArray());
    }

    data$.subscribe(() => {});

    return await firstValueFrom(data$);
  }
}
