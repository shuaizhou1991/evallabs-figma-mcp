import { Form, FormItem, Text, Title } from '@ui5/webcomponents-react';

export function GeneralSection() {
  return (
    <div className="space-y-4">
      <Title level="H4">General</Title>
      <Form 
        titleText=""
        className="bg-white rounded-xl p-8"
      >
        <FormItem label="Archiving Option:">
          <Text>Cloud</Text>
        </FormItem>
        <FormItem label="Days in Final Status:">
          <Text>90</Text>
        </FormItem>
        <FormItem label="Creation Date Before:">
          <Text>01.03.2024, 12:34:56</Text>
        </FormItem>
      </Form>
    </div>
  );
} 