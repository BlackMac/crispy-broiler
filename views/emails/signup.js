module.exports= (data) => {
    return `# Good to see you!

Someone - _hopefully you_ - has signed up for an account at fwdme.co with your email address.

You can validate your email by clicking on the Link below.

__[Click here to activate](${data.key})__

If it wasn't you, you can safely ignore this email and carry on.
We will not send you any more emails, if you don't click on the verification link.

----
Need help? Write to [help@fwdme.co](mailto:help@fwdme.co)

<small>fwdme.co - Stefan Lange-Hegermann, Sedanstr. 3, 40217 Düsseldorf, Germany</small>`
}