import { appUpdateState } from 'src/store'

class ContactService {
  private appUpdateState = appUpdateState

  public addContactToSelected = (id: number) => {
    this.appUpdateState(s => {
      if (!s.contact.selected.includes(id)) {
        s.contact.selected.push(id)
      }
    })
  }

  public removeContactFromSelected = (id: number) => {
    this.appUpdateState(s => {
      const index = s.contact.selected.findIndex(i => i === id)
      if (index !== -1) {
        s.contact.selected.slice(index, 1)
      }
    })
  }
}

export const contactService = new ContactService()
