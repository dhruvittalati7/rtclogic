Here is a very brief descriftion about elasticsearch (ES) backup via API.

ES can do snapshots of indices which can be backed up as usual files and
then can be used for restoring. To do cnapshots ES should have definition
in config (elasticsearch.yml) about some repo like this:

```
...
path.repo: ["/usr/share/elasticsearch/data/elasticsearch-backup"]
```

This dir should exist and should have write permissions for ES user.
PR about this is already provided for current ansible repo.

Then need to create backupd repo via API:
```
curl -XPUT 'http://localhost:9200/_snapshot/elasticsearch-backup' -H 'Content-Type: application/json' -d '{
   "type": "fs",
   "settings": {
       "compress" : true,
       "location": "/usr/share/elasticsearch/data/elasticsearch-backup"
   }
}'
```

This can be run from node on which ES docker container is running. No need to delete repo
after backup and simply new create request can be done. Only need to check if eny error will
rise. After ES created repo in specified dir need to do snapshot:
```
curl -XPUT 'http://localhost:9200/_snapshot/elasticsearch-backup/snapshot2?wait_for_completion=true'
```
or
```
curl -XPUT 'http://localhost:9200/_snapshot/elasticsearch-backup/snapshot2?wait_for_completion=false'
```
depending if we want to wait. Snapshot must have unique name (snapshot2 in example above). Snapshots
are incremental. Next snapshot does not create any updates which already exist in previous one.
Snapshots can be listed by query:
```
curl -X GET "http://localhost:9200/_snapshot/_all"
```
or
```
curl -X GET "http://localhost:9200/_snapshot/_all?pretty"
```
After snapshot is finished content of backup dir can be backed up and removed or not removed - depends
on backup strategy.

To be continued ...
 

