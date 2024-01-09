export interface IStudentPayment {
  student_payment_id: number;
  fee_type: number;
  bill_id: number;
  amount_paid: number;
  student: {
    idx: number;
    admissionnumber: string;
    firstname: string;
    lastname: string;
    phonenumber: string;
    parentemail: string;
    parentorguardian: string;
    class: string;
    fathersemail: string;
  };
  owner: string | null;
  channel: string;
  user: string | null;
  payment_method: string;
}
