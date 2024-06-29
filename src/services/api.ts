export interface ActivityMeta {
  label: string;
  fillColor: string;
}

export interface TotalActivity {
  name: string;
  value: string;
}

export interface DayWiseActivityItem {
  count: string;
  label: string;
  fillColor: string;
}

export interface DayWiseActivity {
  date: string;
  items: {
    children: DayWiseActivityItem[];
  };
}

export interface AuthorWorklogRow {
  name: string;
  totalActivity: TotalActivity[];
  dayWiseActivity: DayWiseActivity[];
}

export interface AuthorWorklog {
  activityMeta: ActivityMeta[];
  rows: AuthorWorklogRow[];
}

export interface DataResponse {
  data: {
    AuthorWorklog: AuthorWorklog;
  };
}


export async function fetchData(): Promise<DataResponse> {
  const response = await fetch('/data.json');
  const data = await response.json();
  return data;
}
