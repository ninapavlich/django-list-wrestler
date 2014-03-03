# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Item'
        db.create_table(u'items_item', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('parent', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['items.Item'], null=True, blank=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('txtid', self.gf('django.db.models.fields.CharField')(unique=True, max_length=255, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('order', self.gf('django.db.models.fields.PositiveIntegerField')(null=True, blank=True)),
        ))
        db.send_create_signal(u'items', ['Item'])

        # Adding model 'SubItem'
        db.create_table(u'items_subitem', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('parent', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['items.Item'], null=True, blank=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('txtid', self.gf('django.db.models.fields.CharField')(unique=True, max_length=255, blank=True)),
            ('position', self.gf('django.db.models.fields.PositiveIntegerField')(null=True, blank=True)),
        ))
        db.send_create_signal(u'items', ['SubItem'])


    def backwards(self, orm):
        # Deleting model 'Item'
        db.delete_table(u'items_item')

        # Deleting model 'SubItem'
        db.delete_table(u'items_subitem')


    models = {
        u'items.item': {
            'Meta': {'ordering': "['order', 'name']", 'object_name': 'Item'},
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'order': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'parent': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['items.Item']", 'null': 'True', 'blank': 'True'}),
            'txtid': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '255', 'blank': 'True'})
        },
        u'items.subitem': {
            'Meta': {'ordering': "['position', 'name']", 'object_name': 'SubItem'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'parent': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['items.Item']", 'null': 'True', 'blank': 'True'}),
            'position': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'txtid': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '255', 'blank': 'True'})
        }
    }

    complete_apps = ['items']