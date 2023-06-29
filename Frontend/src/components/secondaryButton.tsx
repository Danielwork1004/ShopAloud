export const SecondaryButton = ({children, onClick}: {children: any, onClick?: () => void}) => {
  return (
    <button
    type="button"
    className="inline-flex items-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    onClick={onClick}
  >
    {children}
  </button>
  )
}