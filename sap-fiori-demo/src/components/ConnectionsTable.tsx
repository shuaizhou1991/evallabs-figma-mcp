import { Table, TableCell, Button } from '@ui5/webcomponents-react';

const connections = [
  {
    validFrom: '01.06.2025, 00:00:00',
    validTo: '31.12.9999, 23:59:59',
    connectionId: 'Archive_S4',
    systemsId: 'ABC',
    locationId: 'MACO',
    destination: '19,503.26'
  }
];

export function ConnectionsTable() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Connections for Remote Archiving</h2>
        <div className="flex gap-2">
          <Button icon="search" />
          <Button icon="settings" />
          <Button icon="download" />
        </div>
      </div>
      <Table
        columns={<>
          <TableCell>Valid From</TableCell>
          <TableCell>Valid To</TableCell>
          <TableCell>Connection ID</TableCell>
          <TableCell>Systems ID</TableCell>
          <TableCell>Location ID</TableCell>
          <TableCell>Destination</TableCell>
        </>}
      >
        {connections.map((connection, index) => (
          <tr key={index}>
            <TableCell>{connection.validFrom}</TableCell>
            <TableCell>{connection.validTo}</TableCell>
            <TableCell>{connection.connectionId}</TableCell>
            <TableCell>{connection.systemsId}</TableCell>
            <TableCell>{connection.locationId}</TableCell>
            <TableCell>{connection.destination}</TableCell>
          </tr>
        ))}
      </Table>
    </div>
  );
} 