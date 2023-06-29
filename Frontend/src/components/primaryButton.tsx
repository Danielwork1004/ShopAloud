export const PrimaryButton = ({children, onClick}: {children: any, onClick?: () => void}) => {
  return (
    <button
      type="button"
      className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      onClick={onClick}
    >
      {children}
    </button>
  )
}