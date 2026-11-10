import { useState } from 'react'
import { SharedListView } from '@/components/share/SharedListView'
import { Workspace } from '@/components/Workspace'

function App() {
  const [shareToken] = useState(() => new URLSearchParams(window.location.search).get('share'))

  if (shareToken) {
    return <SharedListView token={shareToken} />
  }

  return <Workspace />
}

export default App
