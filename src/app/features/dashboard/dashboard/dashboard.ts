import { Component } from '@angular/core';
import { MapWidget } from '../widgets/map-widget/map-widget/map-widget';
import { LocationWidget } from '../widgets/location-widget/location-widget/location-widget';
import { DataChartWidget } from '../widgets/data-chart-widget/data-chart-widget';
import { DataTableWidget } from '../widgets/data-table-widget/data-table-widget';

@Component({
  selector: 'app-dashboard',
  imports: [
    MapWidget,
    LocationWidget,
    DataChartWidget,
    DataTableWidget,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

}
