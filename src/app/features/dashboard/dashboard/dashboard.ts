import { Component } from '@angular/core';
import { MapWidget } from '../widgets/map-widget/map-widget/map-widget';
import { LocationWidget } from '../widgets/location-widget/location-widget/location-widget';

@Component({
  selector: 'app-dashboard',
  imports: [
    MapWidget,
    LocationWidget
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

}
