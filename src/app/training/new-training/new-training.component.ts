import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { UIService } from 'src/app/shared/ui.service';
import * as fromTraining from '../training.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  exercises$: Observable<Exercise[]>;
  items: Observable<any[]>;
  isLoading = false;
  exerciseSubscription: Subscription;
  private loadingSubscription: Subscription;

  constructor(private trainingService: TrainingService,
    private uiService: UIService, private store: Store<fromTraining.State>) {
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
    this.exercises$ = this.store.select(fromTraining.getAvailableExercises);
    // this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
    //   exercises => {
    //     console.log(exercises);
    //     this.exercises = exercises;
    //   }
    // );
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
    // if (this.exerciseSubscription) {
    //   this.exerciseSubscription.unsubscribe();
    // }
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }
}
