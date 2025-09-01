import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


interface ProfileCardProps {
  name: string;
  email: string;
  image?: string | null;
  onEdit: () => void;
  onLogout: () => void;
}

export function ProfileCard({ name, email, image, onEdit, onLogout }: ProfileCardProps) {
  return (
    <Card className="w-80 h-96 flex flex-col justify-between rounded-2xl shadow-lg">
      <CardContent className="flex flex-col items-center justify-center flex-1 pt-8 pb-4">
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden">
          {image ? (
            <img
              src={image}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="text-3xl text-gray-500">👤</span>
          )}
        </div>
        <div className="text-lg font-semibold text-center">{name}</div>
        <div className="text-sm text-gray-500 text-center">{email}</div>
      </CardContent>
      <CardFooter className="flex gap-2 px-4 pb-6">
        <Button variant="default" className="w-1/2" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="destructive" className="w-1/2" onClick={onLogout}>
          Logout
        </Button>
      </CardFooter>
    </Card>
  );
}
