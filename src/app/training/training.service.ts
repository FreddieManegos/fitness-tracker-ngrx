import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Exercise } from './exercise.model';

@Injectable({ providedIn: 'root' })
export class TrainingService {

  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();

  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private fbSubs: Subscription[] = [];

  constructor(private firestore: AngularFirestore) { }

  fetchAvailableExercises() {
    this.fbSubs.push(this.firestore.collection('availableExercises')
      .snapshotChanges()
      .pipe(map(docArray => {
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
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
      }));
  }

  startExercise(selectedId: string) {
    console.log(selectedId);
    this.firestore.doc('availableExercises/' + selectedId).update({
      lastSelected: new Date()
    })
    this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
    console.log(this.runningExercise);
    this.exerciseChanged.next({
      ...this.runningExercise
    });
  }

  completeExercise() {
    this.addDataToDatabase({ ...this.runningExercise, date: new Date(), state: 'completed' });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({ ...this.runningExercise, duration: this.runningExercise.duration * (progress / 100), calories: this.runningExercise.duration * (progress / 100), date: new Date(), state: 'cancelled' });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  fetchCompletedOrCancelledExercises() {
    // return this.exercises.slice();
    this.fbSubs.push(this.firestore.collection('finishedExercises').valueChanges().subscribe((exercises: Exercise[]) => {
      this.finishedExercisesChanged.next(exercises);
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
