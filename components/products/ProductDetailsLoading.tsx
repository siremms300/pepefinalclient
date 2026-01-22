// components/products/ProductDetailsLoading.tsx
export default function ProductDetailsLoading() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        {/* Back Button Skeleton */}
        <div className="h-6 w-24 bg-gray-200 rounded mb-8"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Skeleton */}
          <div className="space-y-6">
            <div className="aspect-square bg-gray-200 rounded-2xl"></div>
            <div className="flex space-x-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
          
          {/* Content Skeleton */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-10 w-3/4 bg-gray-200 rounded"></div>
            </div>
            
            <div className="flex items-center space-x-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 w-20 bg-gray-200 rounded-full"></div>
              ))}
            </div>
            
            <div className="space-y-3">
              <div className="h-8 w-40 bg-gray-200 rounded"></div>
              <div className="h-6 w-32 bg-gray-200 rounded"></div>
            </div>
            
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            
            <div className="space-y-4">
              <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
              <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



























// // components/products/ProductDetailsLoading.tsx
// export default function ProductDetailsLoading() {
//   return (
//     <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//       <div className="animate-pulse space-y-12">
//         {/* Back Button Skeleton */}
//         <div className="h-6 w-32 bg-gray-200 rounded"></div>
        
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//           {/* Image Skeleton */}
//           <div className="space-y-4">
//             <div className="aspect-square bg-gray-200 rounded-2xl"></div>
//             <div className="flex space-x-4">
//               {[...Array(3)].map((_, i) => (
//                 <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
//               ))}
//             </div>
//           </div>
          
//           {/* Content Skeleton */}
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <div className="h-4 w-32 bg-gray-200 rounded"></div>
//               <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
//             </div>
            
//             <div className="flex items-center space-x-4">
//               {[...Array(3)].map((_, i) => (
//                 <div key={i} className="h-10 w-24 bg-gray-200 rounded-full"></div>
//               ))}
//             </div>
            
//             <div className="space-y-4">
//               <div className="h-4 w-48 bg-gray-200 rounded"></div>
//               <div className="h-6 w-32 bg-gray-200 rounded"></div>
//             </div>
            
//             <div className="space-y-4">
//               <div className="h-4 bg-gray-200 rounded"></div>
//               <div className="h-4 bg-gray-200 rounded"></div>
//               <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//             </div>
            
//             <div className="space-y-4">
//               <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
//               <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }