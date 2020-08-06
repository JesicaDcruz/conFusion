import { Component, OnInit, Inject } from '@angular/core';

import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
	leader:Leader[];

  constructor(private leaderService: LeaderService, @Inject('BaseURL') private baseURL) { }

  ngOnInit() {
      this.leaderService.getLeaders().subscribe(leaders => this.leader = leaders);
  	//this.leader = this.leaderService.getLeaders();
  }

}
