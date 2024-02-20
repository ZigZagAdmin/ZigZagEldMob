export interface DriverStatus {
  driverId: string;

  vehicleId: string;
  eventType?: {
    code: string;
    name?: string;
    description?: string;
  };
  location?: {
    locationType?: string;
    description?: string;
    latitude?: number;
    longitude?: number;
  };
  breakTime?: EldTime;
  driveTime?: EldTime;
  shiftTime?: EldTime;
  cycleTime?: EldTime;
  lastEventDate?: number;
  updateDate?: number;
}

interface EldTime {
  availableTime: number;
  accumulatedTime: number;
  limitTime: number;
}
