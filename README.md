# n8n-nodes-pritset

Generate PDFs from Pritset templates in n8n. The node can return a generated PDF directly as binary data or request asynchronous delivery to a webhook.

## Installation

Install `n8n-nodes-pritset` from **Settings > Community Nodes** in a self-hosted n8n instance. For alternative installation methods, see the [n8n community node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).

## Operations

- **Direct:** Wait for Pritset to generate the PDF and return it in the `data` binary field.
- **Webhook:** Start PDF generation, return the Pritset API response, and have Pritset deliver the generated PDF to a public webhook URL.

## Credentials

Create a **Pritset API** credential in n8n with:

- **Access Token:** Sent in the `Authorization` header.
- **Secret Key:** Sent in the `X-Secret` header.

Both values are stored as password fields by n8n. Obtain them from your Pritset account.

## Usage

1. Add the **Pritset** node to a workflow.
2. Select or create a **Pritset API** credential.
3. Enter the Pritset template ID. The default expression reads `templateId` from the incoming item.
4. Choose **Direct** or **Webhook** mode.
5. Provide the template data as a JSON object. By default, the node uses `data` from the incoming item, or the entire item when `data` is absent.
6. In webhook mode, provide a publicly reachable webhook URL.

### Example input

```json
{
  "templateId": "your-template-id",
  "data": {
    "customerName": "Ada Lovelace",
    "invoiceNumber": "INV-1001"
  }
}
```

### Output

- Direct mode returns metadata in `json` and the generated PDF in `binary.data`.
- Webhook mode returns the Pritset API response together with `templateId` and `mode`.

## Compatibility

Tested with n8n 2.30.7 and Node.js 22.

## Resources

- [Pritset template API documentation](https://pritset.com/docs/api/template/)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE.md)
