import { FlatfileListener } from '@flatfile/listener'
import { plmSpaceConfigure } from './actions/plm'
import { ecommerceSpaceConfigure } from './actions/ecommerce'
import { ExcelExtractor } from '@flatfile/plugin-xlsx-extractor'
import { JSONExtractor } from '@flatfile/plugin-json-extractor'

export default function (listener: FlatfileListener) {
  listener.on('**', (event) => {
    console.log(
      `-> My event listener received an event: ${JSON.stringify(event.topic)}`
    )
  })

  listener.namespace('space:plmproject', (listener) => {
    listener.use(plmSpaceConfigure)
    listener.use(ExcelExtractor())
    listener.use(JSONExtractor())
  })

  listener.namespace('space:ecommerceproject', (listener) => {
    listener.use(ecommerceSpaceConfigure)
    listener.use(ExcelExtractor())
    listener.use(JSONExtractor())
  })
}
