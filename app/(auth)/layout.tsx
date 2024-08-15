export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-165px)] flex flex-col items-center justify-center">
      <div className="w-[450px] border border-solid border-gray-400 rounded-sm p-6">
        {children}
      </div>
    </div>
  )
}