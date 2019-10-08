import { TModel as TCampaign } from 'src/models/Campaign'

export const sortCampaigns = (a: TCampaign, b: TCampaign) => {
  if (a.status !== b.status) {
    if (a.status === 'draft') { return -1 }
    if (b.status === 'draft') { return 1 }
    if (a.status === 'scheduled') { return -1 }
    if (b.status === 'scheduled') { return 1 }
    if (a.status === 'launched') { return -1 }
    if (b.status === 'launched') { return 1 }
    if (a.status === 'finished') { return -1 }
    if (b.status === 'finished') { return 1 }
    if (a.status === 'failed') { return -1 }
    if (b.status === 'failed') { return 1 }
  }

  return b.id - a.id
}
