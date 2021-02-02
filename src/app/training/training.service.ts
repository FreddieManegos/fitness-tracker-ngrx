import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UIService } from '../shared/ui.service';
import { Exercise } from './exercise.model';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as Training from './training.actions'
import * as fromTraining from './training.reducer';

@Injectable({ providedIn: 'root' })
export class TrainingService {

  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();

  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private fbSubs: Subscription[] = [];

  constructor(private firestore: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromTraining.State>
  ) { }

  fetchAvailableExercises() {
    this.fbSubs.push(this.firestore.collection('availableExercises')
      .snapshotChanges()
      .pipe(map(docArray => {
        // throw(new Error)
        return docArray.map(
          doc => {
            return {
              id: doc.payload.doc.id,
              name: doc.payload.doc.data()['name'],
              duration: doc.payload.doc.data()['duration'],
              calories: doc.payload.doc.data()['calories'],
            }
          }
        )
      })).subscribe((exercises: Exercise[]) => {
        console.log(exercises);
        // this.availableExercises = exercises;\
        // this.exercisesChanged.next([...this.availableExercises]);
        this.store.dispatch(new Training.SetAvailableTrainings(exercises));
      }, error => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar('Fetching Exercises failed, please try again later', null, 3000);
        this.exercisesChanged.next(null);
      }));
  }

  startExercise(selectedId: string) {
    console.log(selectedId);
    // this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
    // console.log(this.runningExercise);
    // this.exerciseChanged.next({
    //   ...this.runningExercise
    // });
    this.store.dispatch(new Training.StartTraining(selectedId));

  }

  completeExercise() {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      this.addDataToDatabase({ ...ex, date: new Date(), state: 'completed' });
      // this.runningExercise = null;
      // this.exerciseChanged.next(null);
      this.store.dispatch(new Training.StopTraining());

    })
  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      this.addDataToDatabase({ ...ex, duration: ex.duration * (progress / 100), calories: ex.duration * (progress / 100), date: new Date(), state: 'cancelled' });
      // this.runningExercise = null;
      // this.exerciseChanged.next(null);
      this.store.dispatch(new Training.StopTraining());
    })
  }

  // getRunningExercise() {
  //   return { ...this.runningExercise };
  // }

  fetchCompletedOrCancelledExercises() {
    // return this.exercises.slice();
    this.fbSubs.push(this.firestore.collection('finishedExercises').valueChanges().subscribe((exercises: Exercise[]) => {
      // this.finishedExercisesChanged.next(exercises);
      this.store.dispatch(new Training.SetFinishedTrainings(exercises))
    }, error => {
      console.log(error);
    }));
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    this.firestore.collection('finishedExercises').add(exercise);
  }
}
