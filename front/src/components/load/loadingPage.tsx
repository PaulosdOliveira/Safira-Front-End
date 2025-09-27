'use client'

export const Loading = () => {
    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <div className="animate-bounce  rounded-full h-16 w-16  bg-gray-100">
                <div className="animate-spin h-16 w-16 rounded-full border-4 border-t-blue-500 bg-gray-100" />
            </div>
        </div>
    )
}