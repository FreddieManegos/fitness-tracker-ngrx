import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Exercise } from '../exercise.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { TrainingService } from '../training.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {

  exercises: Exercise[] = [];
  items: Observable<any[]>;
  constructor(private trainingService: TrainingService, firestore: AngularFirestore) {
    firestore.collection('availableExercises').valueChanges().subscribe(result => {
      console.log(result);
    });
    // console.log(this.items);
  }

  ngOnInit() {
    // this.exercises = this.trainingService.getAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

}
