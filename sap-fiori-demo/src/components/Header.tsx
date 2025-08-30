import { Title, Button, Text } from '@ui5/webcomponents-react';

export function Header() {
  return (
    <div className="bg-white p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <Title level="H1">Archiving Configuration</Title>
        </div>
        <div className="flex gap-2">
          <Button design="Emphasized">Edit</Button>
          <Button icon="action" design="Transparent" />
        </div>
      </div>
      
      <div className="flex gap-16">
        <div className="space-y-2">
          <div className="flex gap-2">
            <Text className="text-[#556b82]">Created At:</Text>
            <Text>08.05.2025, 12:34:56</Text>
          </div>
          <div className="flex gap-2">
            <Text className="text-[#556b82]">Created By:</Text>
            <Text>Robotech</Text>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex gap-2">
            <Text className="text-[#556b82]">Changed At:</Text>
            <Text>10.04.2025, 12:34:56</Text>
          </div>
          <div className="flex gap-2">
            <Text className="text-[#556b82]">Changed By:</Text>
            <Text>Robotech</Text>
          </div>
        </div>
      </div>
    </div>
  );
} 