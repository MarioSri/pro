@@ .. @@
 interface ResponsiveCardProps {
   title?: string;
   children: ReactNode;
   className?: string;
   actions?: Array<{
     label: string;
     onClick: () => void;
     variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
     icon?: ReactNode;
     disabled?: boolean;
   }>;
   swipeActions?: {
     left?: Array<{
       label: string;
       onClick: () => void;
       variant?: "default" | "destructive" | "success";
       icon?: ReactNode;
     }>;
     right?: Array<{
       label: string;
       onClick: () => void;
       variant?: "default" | "destructive" | "success";
       icon?: ReactNode;
     }>;
   };
 }
 
 export const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
   title,
   children,
   className,
   actions = [],
   swipeActions
 }) => {
   const { isMobile } = useResponsive();
   const [swipeOffset, setSwipeOffset] = React.useState(0);
   const [isDragging, setIsDragging] = React.useState(false);
 
   const handleTouchStart = (e: React.TouchEvent) => {
     if (!swipeActions || !isMobile) return;
     setIsDragging(true);
     setSwipeOffset(0);
   };
 
   const handleTouchMove = (e: React.TouchEvent) => {
     if (!isDragging || !swipeActions || !isMobile) return;
     
     const touch = e.touches[0];
     const startX = e.currentTarget.getBoundingClientRect().left;
     const currentX = touch.clientX;
-    const offset = currentX - startX - 200; // Adjust for card width
+    const offset = currentX - startX - (e.currentTarget.getBoundingClientRect().width / 2);
     
     setSwipeOffset(Math.max(-150, Math.min(150, offset)));
   };
 
   const handleTouchEnd = () => {
     if (!isDragging || !swipeActions || !isMobile) return;
     
     setIsDragging(false);
     
     if (Math.abs(swipeOffset) > 80) {
       const direction = swipeOffset > 0 ? 'right' : 'left';
       const actionsToShow = direction === 'left' ? swipeActions.left : swipeActions.right;
       
       if (actionsToShow && actionsToShow.length > 0) {
         // Execute first action for simplicity
         actionsToShow[0].onClick();
       }
     }
     
     setSwipeOffset(0);
   };
 
   return (
     <div className="relative overflow-hidden">
       {/* Swipe Actions Background */}
       {isMobile && swipeActions && (
         <>
           {/* Left Actions */}
           {swipeActions.left && (
-            <div className="absolute left-0 top-0 h-full flex items-center z-10">
+            <div className="absolute left-0 top-0 h-full flex items-center z-10 min-h-[80px]">
               {swipeActions.left.map((action, index) => (
                 <Button
                   key={index}
                   variant="ghost"
                   className={cn(
-                    "h-full rounded-none px-4 min-w-[80px]",
+                    "h-full rounded-none px-4 min-w-[88px] min-h-[80px]",
                     action.variant === 'destructive' && "bg-destructive text-destructive-foreground",
                     action.variant === 'success' && "bg-success text-success-foreground"
                   )}
                   onClick={action.onClick}
                 >
-                  <div className="flex flex-col items-center gap-1">
+                  <div className="flex flex-col items-center gap-2">
                     {action.icon}
-                    <span className="text-xs">{action.label}</span>
+                    <span className="text-xs leading-tight text-center">{action.label}</span>
                   </div>
                 </Button>
               ))}
             </div>
           )}
 
           {/* Right Actions */}
           {swipeActions.right && (
-            <div className="absolute right-0 top-0 h-full flex items-center z-10">
+            <div className="absolute right-0 top-0 h-full flex items-center z-10 min-h-[80px]">
               {swipeActions.right.map((action, index) => (
                 <Button
                   key={index}
                   variant="ghost"
                   className={cn(
-                    "h-full rounded-none px-4 min-w-[80px]",
+                    "h-full rounded-none px-4 min-w-[88px] min-h-[80px]",
                     action.variant === 'destructive' && "bg-destructive text-destructive-foreground",
                     action.variant === 'success' && "bg-success text-success-foreground"
                   )}
                   onClick={action.onClick}
                 >
-                  <div className="flex flex-col items-center gap-1">
+                  <div className="flex flex-col items-center gap-2">
                     {action.icon}
-                    <span className="text-xs">{action.label}</span>
+                    <span className="text-xs leading-tight text-center">{action.label}</span>
                   </div>
                 </Button>
               ))}
             </div>
           )}
         </>
       )}
 
       {/* Main Card */}
       <Card
         className={cn(
-          "shadow-elegant transition-all duration-200 touch-manipulation",
+          "shadow-elegant transition-all duration-200 touch-manipulation min-h-[80px]",
           isDragging && "transition-none",
           className
         )}
         style={{
           transform: `translateX(${swipeOffset}px)`,
         }}
         onTouchStart={handleTouchStart}
         onTouchMove={handleTouchMove}
         onTouchEnd={handleTouchEnd}
       >
-        <CardContent className="p-4 md:p-6">
+        <CardContent className="p-4 md:p-6 min-h-[60px]">
           {children}
         </CardContent>
       </Card>
     </div>
   );
 };