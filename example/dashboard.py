from django.core.urlresolvers import reverse
from django.utils.translation import ugettext_lazy as _
from grappelli.dashboard import modules, Dashboard

class ExampleDashboard(Dashboard):
    def __init__(self, **kwargs):

        Dashboard.__init__(self, **kwargs)

        # append an app list module for "Applications"
        self.children.append(modules.AppList(
            title=_('Applications'),
            column=1,
            collapsible=True,
            exclude=('django.contrib.*',),
        ))

        # append an app list module for "Administration"
        self.children.append(modules.AppList(
            title=_('Administration'),
            column=1,
            collapsible=True,
            models=('django.contrib.*',),
        ))

        # append a recent actions module
        self.children.append(modules.RecentActions(
            title=_('Recent Actions'),
            column=2,
            collapsible=False,
            limit=5,
        ))

        self.children.append(modules.LinkList(
            layout='inline',
            column=2,
            children=(
                {
                    'title': 'Python website',
                    'url': 'http://www.python.org',
                    'external': True,
                    'description': 'Python programming language rocks!',
                },
                ['Django website', 'http://www.djangoproject.com', True],
                ['Some internal link', '/some/internal/link/'],
            )
        ))