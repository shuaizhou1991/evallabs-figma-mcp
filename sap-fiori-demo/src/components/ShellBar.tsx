import { ShellBar as UI5ShellBar, ShellBarItem, Avatar } from '@ui5/webcomponents-react';

export function ShellBar() {
  return (
    <UI5ShellBar
      primaryTitle="Configure Archiving"
      showCoPilot={false}
      showProductSwitch={false}
      showNotifications={false}
      profile={
        <Avatar>
          <img src="/profile.png" alt="User Profile" />
        </Avatar>
      }
    >
      <ShellBarItem icon="sys-help" text="Help" />
    </UI5ShellBar>
  );
} 