import { Component, OnInit } from '@angular/core';

import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
	leader:Leader[];

  constructor(private leaderService: LeaderService) { }

  ngOnInit() {
  	this.leader = this.leaderService.getLeaders();
  }

}
