import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TrainingService } from '../training.service';
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator';
import { Store } from '@ngrx/store';

import { Exercise } from '../exercise.model';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';

import * as fromTraining from '../training.reducer';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = [
    'date', 'name', 'duration', 'calories', 'state'
  ];
  dataSource = new MatTableDataSource<Exercise>();
  finishedExercisesSubs: Subscription;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private trainingService: TrainingService, private store: Store<fromTraining.State>) { }

  ngOnInit() {
    this.store.select(fromTraining.getFinishedExercises).subscribe((exercises: Exercise[]) => {
      this.dataSource.data = exercises;
    })
    this.trainingService.fetchCompletedOrCancelledExercises();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  convertDate(timestamp) {
    return new Date(timestamp);
  }

  ngOnDestroy() {
    // if (this.finishedExercisesSubs) {
    //   this.finishedExercisesSubs.unsubscribe();
    // }
  }

}
