# Re-design... Again
Now, this re-design was about a different topic: simplification. You may or may not have
noticed that all ``colonialwars-appserver`` does is serve static files, and that ``colonialwars-main`` only
spawns instances of ``colonialwars-appserver``.

Moving forward, ``colonialwars-appserver`` might have
had a dynamic route in which clients could get the available game servers from, and ``colonialwars-main``
might have had to send the ``colonialwars-appserver`` instances information about available game servers.
But I realized soon enough that the planned design was not sufficient. What if a ``colonialwars-gameserver``
process was spawned on another machine?

Instead of further complicating the design, I decided on this:
- Removing ``colonialwars-appserver`` and ``colonialwars-main``,
- Creating a project called ``colonialwars-static`` to house static, client-side files,
- Renaming ``colonialwars-gameserver`` to ``colonialwars-server``, and
- Re-thinking the logic for communications from front-end to back-end.

To summarize, everything has been simplified.
