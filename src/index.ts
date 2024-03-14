import { FlatfileListener } from '@flatfile/listener'
import { plmProjectSpaceConfigure } from './actions/plm'
import { ecommerceProjectSpaceConfigure } from './actions/ecommerce'
import { fieldServicesProjectSpaceConfigure } from './actions/fieldServicesProjects'
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor'
import { JSONExtractor } from '@flatfile/plugin-json-extractor'

export default function (listener: FlatfileListener) {
  listener.on('**', (event) => {
    console.log(
      `-> My event listener received an event: ${JSON.stringify(event.topic)}`
    )
  })

  listener.namespace('space:plmproject', (listener) => {
    listener.use(plmProjectSpaceConfigure)
    listener.use(ExcelExtractor())
    listener.use(JSONExtractor())
  })

  listener.namespace('space:ecommerceproject', (listener) => {
    listener.use(ecommerceProjectSpaceConfigure)
    listener.use(ExcelExtractor())
    listener.use(JSONExtractor())
  })

  listener.namespace('space:servicesproject', (listener) => {
    listener.use(fieldServicesProjectSpaceConfigure)
    listener.use(ExcelExtractor())
    listener.use(JSONExtractor())
  })
}
