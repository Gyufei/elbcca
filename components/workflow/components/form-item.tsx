


type FormItemProps = {
  className?: string;
  title: React.ReactNode;
  children: React.ReactNode;
}
export const FormItem = ({
 title,
 children,
 className = ''
}: FormItemProps) => {
  return (
    <div className={`col mt-3 flex flex-col ${className}`}>
      <div className="LabelText mb-1">{title}</div>
      {children}
    </div>
  )
}
