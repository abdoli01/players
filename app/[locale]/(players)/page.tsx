import { Button } from "@/components/ui/button"
import Counter from "@/components/Counter";
export default function Home() {
  return (
     <>
         <div className={'font-bold text-amber-700'}>
             سلام
         </div>
         <div className={'font-bold text-xl'}>Home</div>
         <Counter/>
         {/*<Button>Click me</Button>*/}
     </>
  );
}
