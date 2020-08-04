import { Component, OnInit, Input , ViewChild} from '@angular/core';
import { Dish } from '../shared/dish';

import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { switchMap } from 'rxjs/operators';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Comment } from '../shared/comment';
import { DISHES } from '../shared/dishes';


@Component({
  selector: 'app-dishdetails',
  templateUrl: './dishdetails.component.html',
  styleUrls: ['./dishdetails.component.scss']
})

export class DishdetailsComponent implements OnInit {

  commentForm: FormGroup;
  comments:Comment;
  @ViewChild('cform') commentFormDirective;
	
  dish: Dish;
  dishIds: string[];
  prev:string;
  next:string;

  cformErrors = {
    'author': '',
    'comment': '',
  };

  cvalidationMessages = {
    'author': {
      'required':      'Author Name is required.',
      'minlength':     'Author Name must be at least 2 characters long.',
      'maxlength':     'Author Name cannot be more than 25 characters long.'
    },
    'comment':{
      'required':      'Comment is required.'
    }
  };
	
  constructor(private cfb: FormBuilder,private dishservice: DishService, private route: ActivatedRoute,private location: Location) {
      this.createCommentForm();
   }

  ngOnInit() {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
  	this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
    .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
    
    //this.dish = this.dishservice.getDish(id);
  }

  createCommentForm(){
    this.commentForm = this.cfb.group({
      author: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      rating:5,
      comment: ['', Validators.required]
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.cformErrors) {
      if (this.cformErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.cformErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.cvalidationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.cformErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }


  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit() {
    this.comments = this.commentForm.value;
    console.log(this.comments);
    let today=new Date();
     let mycomment={
      rating: this.comments.rating,
      comment: this.comments.comment,
      author: this.comments.author,
      date: today.toISOString()
     }
     console.log(mycomment);
    this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
    .subscribe(dish=>{this.dish=dish; this.dish.comments.push(mycomment)});
    this.commentForm.reset({
      author: '',
      rating: 0,
      comment: ''   
    });
    this.commentFormDirective.resetForm();
  }



}
