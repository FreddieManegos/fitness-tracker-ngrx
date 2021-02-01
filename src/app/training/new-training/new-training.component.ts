import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  exercises: Exercise[];
  items: Observable<any[]>;
  isLoading = false;
  exerciseSubscription: Subscription;
  private loadingSubscription: Subscription;

  constructor(private trainingService: TrainingService, private uiService: UIService) {
    // this.exercises =
    //   firestore.collection('availableExercises')
    //     .snapshotChanges()
    //     .pipe(map(docArray => {
    //       return docArray.map(
    //         doc => {
    //           return {
    //             id: doc.payload.doc.id,
    //             name: doc.payload.doc.data()['name'],
    //             duration: doc.payload.doc.data()['duration'],
    //             calories: doc.payload.doc.data()['calories'],
    //           }
    //         }
    //       )
    //     }));
    // console.log(this.items);
  }

  ngOnInit() {
    // this.exercises = this.trainingService.getAvailableExercises();
    this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(
      isLoading => {
        this.isLoading = isLoading;
      }
    );
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
      exercises => {
        console.log(exercises);
        this.exercises = exercises;
      }
    );
    this.trainingService.fetchAvailableExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }


  onStartTraining(form: NgForm) {
    console.log(form);
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy() {
    this.exerciseSubscription.unsubscribe();
    this.loadingSubscription.unsubscribe();
  }
}
