import { Settings as SettingsIcon, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function Settings() {
  return (
    <div className="h-full overflow-auto space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account and application preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Update your company details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Company Name</label>
            <Input placeholder="ACME Corporation" defaultValue="ACME" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" placeholder="contact@acme.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Website</label>
            <Input type="url" placeholder="https://acme.com" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <input type="checkbox" defaultChecked className="size-5 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New Candidate Alerts</p>
              <p className="text-sm text-muted-foreground">Get notified of new applications</p>
            </div>
            <input type="checkbox" defaultChecked className="size-5 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Interview Reminders</p>
              <p className="text-sm text-muted-foreground">Receive interview reminders</p>
            </div>
            <input type="checkbox" defaultChecked className="size-5 rounded" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}

