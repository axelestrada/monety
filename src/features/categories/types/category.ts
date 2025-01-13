export default interface ICategory {
  id: number;
  name: string;
  icon: number;
  color: number;
  type: "income" | "expense";
}
