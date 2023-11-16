interface Student {
  idx: number;
  admissionnumber: string;
  firstname: string;
  lastname: string;
}

interface Classroom {
  students: Student[];
  pagination_info: {
    total_students: number;
    page: number;
    total_pages: number;
    next_page: string | null;
    prev_page: string | null;
  };
}

export interface SchoolData {
  [className: string]: Classroom;
}
