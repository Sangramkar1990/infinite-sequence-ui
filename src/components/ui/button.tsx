import { cn } from "../../lib/utils"; // Optional utility

// export function Button({
//   children,
//   className,
  
//   ...props
// }: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {

//    const variants = {
//     solid: "bg-[#815f55] text-white hover:bg-[#6b4d45]",
//     outline: "bg-white border border-[#e3e3e6] text-[#815f55] hover:bg-[#f9f9f9]",
//   };

//   return (
//     <button
//       className={cn(
//         "inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700",
//         className
//       )}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// }



type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  variant?: "solid" | "outline";
};

export function Button({
  children,
  className,
  variant = "solid",
  ...props
}: ButtonProps) {
  const variants = {
    solid: "bg-[#815f55] text-white hover:bg-[#6b4d45]",
    outline:
      "bg-white border border-[#e3e3e6] text-[#815f55] hover:bg-[#f9f9f9]",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center px-4 py-2 rounded transition",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

