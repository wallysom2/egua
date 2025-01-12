import { Loader2, type LucideProps } from "lucide-react";
import { FaGoogle } from "react-icons/fa";

export const Icons = {
  spinner: Loader2,
  google: (props: LucideProps) => <FaGoogle {...props} />,
}; 