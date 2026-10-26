'use client'

import { useEffect, useRef, useState } from 'react'

interface InstallEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallButton() {
  const sheetRef = useRef<HTMLDialogElement>(null)
  const promptRef = useRef<InstallEvent | null>(null)
  const [canPrompt, setCanPrompt] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault()
      promptRef.current = e as InstallEvent
      setCanPrompt(true)
    }
    const onInstalled = () => {
      setInstalled(true)
      setCanPrompt(false)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    if (window.matchMedia('(display-mode: standalone)').matches) setInstalled(true)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const install = async () => {
    const event = promptRef.current
    if (!event) {
      sheetRef.current?.showModal()
      return
    }
    await event.prompt()
    const choice = await event.userChoice
    if (choice.outcome === 'accepted') setInstalled(true)
    promptRef.current = null
    setCanPrompt(false)
  }

  return (
    <>
      <button type="button" className="btn btn--gold" onClick={install} disabled={installed}>
        {installed ? 'Installed on this device' : canPrompt ? 'Install' : 'How to install'}
      </button>

      <dialog ref={sheetRef} className="sheet" aria-label="How to install">
        <div className="sheet__inner">
          <span className="sheet__grip" aria-hidden="true" />
          <div className="sheet__head">
            <h2 className="sheet__title">Put it on your home screen</h2>
            <button type="button" className="sheet__close" onClick={() => sheetRef.current?.close()}>
              Close
            </button>
          </div>
          <div className="sheet__body">
            <p className="body-text">
              Civicly runs in the browser, so there is no app store download and no account. Adding it to your home screen gives it an icon and opens it without browser chrome.
            </p>
            <ul className="storelist">
              <li>
                <strong>iPhone and iPad</strong>
                <span>In Safari, press Share, then Add to Home Screen.</span>
              </li>
              <li>
                <strong>Android</strong>
                <span>In Chrome, press the three dot menu, then Add to home screen or Install app.</span>
              </li>
              <li>
                <strong>Desktop</strong>
                <span>In Chrome or Edge, press the install icon at the right of the address bar.</span>
              </li>
            </ul>
          </div>
        </div>
      </dialog>
    </>
  )
}
