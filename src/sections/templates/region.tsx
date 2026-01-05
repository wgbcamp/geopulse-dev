import { ComboBox } from './sub/comboBox';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const Region = () => {
    return(
        <Card className="bg-[#1E1E1E] w-full h-7/10 dark flex items-center shadow-md">
            <ComboBox/>
        </Card>
    )
}