# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: google/protobuf/unittest_mset.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


from google.protobuf import unittest_mset_wire_format_pb2 as google_dot_protobuf_dot_unittest__mset__wire__format__pb2


DESCRIPTOR = _descriptor.FileDescriptor(
  name='google/protobuf/unittest_mset.proto',
  package='protobuf_unittest',
  syntax='proto2',
  serialized_options=b'H\001\370\001\001',
  create_key=_descriptor._internal_create_key,
  serialized_pb=b'\n#google/protobuf/unittest_mset.proto\x12\x11protobuf_unittest\x1a/google/protobuf/unittest_mset_wire_format.proto\"Z\n\x17TestMessageSetContainer\x12?\n\x0bmessage_set\x18\x01 \x01(\x0b\x32*.proto2_wireformat_unittest.TestMessageSet\"\xf9\x01\n\x18TestMessageSetExtension1\x12\t\n\x01i\x18\x0f \x01(\x05\x12=\n\trecursive\x18\x10 \x01(\x0b\x32*.proto2_wireformat_unittest.TestMessageSet\x12\x19\n\rtest_aliasing\x18\x11 \x01(\tB\x02\x08\x02\x32x\n\x15message_set_extension\x12*.proto2_wireformat_unittest.TestMessageSet\x18\xb0\xa6^ \x01(\x0b\x32+.protobuf_unittest.TestMessageSetExtension1\"\xa1\x01\n\x18TestMessageSetExtension2\x12\x0b\n\x03str\x18\x19 \x01(\t2x\n\x15message_set_extension\x12*.proto2_wireformat_unittest.TestMessageSet\x18\xf9\xbb^ \x01(\x0b\x32+.protobuf_unittest.TestMessageSetExtension2\"n\n\rRawMessageSet\x12\x33\n\x04item\x18\x01 \x03(\n2%.protobuf_unittest.RawMessageSet.Item\x1a(\n\x04Item\x12\x0f\n\x07type_id\x18\x02 \x02(\x05\x12\x0f\n\x07message\x18\x03 \x02(\x0c\x42\x05H\x01\xf8\x01\x01'
  ,
  dependencies=[google_dot_protobuf_dot_unittest__mset__wire__format__pb2.DESCRIPTOR,])




_TESTMESSAGESETCONTAINER = _descriptor.Descriptor(
  name='TestMessageSetContainer',
  full_name='protobuf_unittest.TestMessageSetContainer',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='message_set', full_name='protobuf_unittest.TestMessageSetContainer.message_set', index=0,
      number=1, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto2',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=107,
  serialized_end=197,
)


_TESTMESSAGESETEXTENSION1 = _descriptor.Descriptor(
  name='TestMessageSetExtension1',
  full_name='protobuf_unittest.TestMessageSetExtension1',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='i', full_name='protobuf_unittest.TestMessageSetExtension1.i', index=0,
      number=15, type=5, cpp_type=1, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='recursive', full_name='protobuf_unittest.TestMessageSetExtension1.recursive', index=1,
      number=16, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='test_aliasing', full_name='protobuf_unittest.TestMessageSetExtension1.test_aliasing', index=2,
      number=17, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=b'\010\002', file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
    _descriptor.FieldDescriptor(
      name='message_set_extension', full_name='protobuf_unittest.TestMessageSetExtension1.message_set_extension', index=0,
      number=1545008, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=True, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto2',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=200,
  serialized_end=449,
)


_TESTMESSAGESETEXTENSION2 = _descriptor.Descriptor(
  name='TestMessageSetExtension2',
  full_name='protobuf_unittest.TestMessageSetExtension2',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='str', full_name='protobuf_unittest.TestMessageSetExtension2.str', index=0,
      number=25, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
    _descriptor.FieldDescriptor(
      name='message_set_extension', full_name='protobuf_unittest.TestMessageSetExtension2.message_set_extension', index=0,
      number=1547769, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=True, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto2',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=452,
  serialized_end=613,
)


_RAWMESSAGESET_ITEM = _descriptor.Descriptor(
  name='Item',
  full_name='protobuf_unittest.RawMessageSet.Item',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='type_id', full_name='protobuf_unittest.RawMessageSet.Item.type_id', index=0,
      number=2, type=5, cpp_type=1, label=2,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='message', full_name='protobuf_unittest.RawMessageSet.Item.message', index=1,
      number=3, type=12, cpp_type=9, label=2,
      has_default_value=False, default_value=b"",
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto2',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=685,
  serialized_end=725,
)

_RAWMESSAGESET = _descriptor.Descriptor(
  name='RawMessageSet',
  full_name='protobuf_unittest.RawMessageSet',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='item', full_name='protobuf_unittest.RawMessageSet.item', index=0,
      number=1, type=10, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
  ],
  nested_types=[_RAWMESSAGESET_ITEM, ],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto2',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=615,
  serialized_end=725,
)

_TESTMESSAGESETCONTAINER.fields_by_name['message_set'].message_type = google_dot_protobuf_dot_unittest__mset__wire__format__pb2._TESTMESSAGESET
_TESTMESSAGESETEXTENSION1.fields_by_name['recursive'].message_type = google_dot_protobuf_dot_unittest__mset__wire__format__pb2._TESTMESSAGESET
_RAWMESSAGESET_ITEM.containing_type = _RAWMESSAGESET
_RAWMESSAGESET.fields_by_name['item'].message_type = _RAWMESSAGESET_ITEM
DESCRIPTOR.message_types_by_name['TestMessageSetContainer'] = _TESTMESSAGESETCONTAINER
DESCRIPTOR.message_types_by_name['TestMessageSetExtension1'] = _TESTMESSAGESETEXTENSION1
DESCRIPTOR.message_types_by_name['TestMessageSetExtension2'] = _TESTMESSAGESETEXTENSION2
DESCRIPTOR.message_types_by_name['RawMessageSet'] = _RAWMESSAGESET
_sym_db.RegisterFileDescriptor(DESCRIPTOR)

TestMessageSetContainer = _reflection.GeneratedProtocolMessageType('TestMessageSetContainer', (_message.Message,), {
  'DESCRIPTOR' : _TESTMESSAGESETCONTAINER,
  '__module__' : 'google.protobuf.unittest_mset_pb2'
  # @@protoc_insertion_point(class_scope:protobuf_unittest.TestMessageSetContainer)
  })
_sym_db.RegisterMessage(TestMessageSetContainer)

TestMessageSetExtension1 = _reflection.GeneratedProtocolMessageType('TestMessageSetExtension1', (_message.Message,), {
  'DESCRIPTOR' : _TESTMESSAGESETEXTENSION1,
  '__module__' : 'google.protobuf.unittest_mset_pb2'
  # @@protoc_insertion_point(class_scope:protobuf_unittest.TestMessageSetExtension1)
  })
_sym_db.RegisterMessage(TestMessageSetExtension1)

TestMessageSetExtension2 = _reflection.GeneratedProtocolMessageType('TestMessageSetExtension2', (_message.Message,), {
  'DESCRIPTOR' : _TESTMESSAGESETEXTENSION2,
  '__module__' : 'google.protobuf.unittest_mset_pb2'
  # @@protoc_insertion_point(class_scope:protobuf_unittest.TestMessageSetExtension2)
  })
_sym_db.RegisterMessage(TestMessageSetExtension2)

RawMessageSet = _reflection.GeneratedProtocolMessageType('RawMessageSet', (_message.Message,), {

  'Item' : _reflection.GeneratedProtocolMessageType('Item', (_message.Message,), {
    'DESCRIPTOR' : _RAWMESSAGESET_ITEM,
    '__module__' : 'google.protobuf.unittest_mset_pb2'
    # @@protoc_insertion_point(class_scope:protobuf_unittest.RawMessageSet.Item)
    })
  ,
  'DESCRIPTOR' : _RAWMESSAGESET,
  '__module__' : 'google.protobuf.unittest_mset_pb2'
  # @@protoc_insertion_point(class_scope:protobuf_unittest.RawMessageSet)
  })
_sym_db.RegisterMessage(RawMessageSet)
_sym_db.RegisterMessage(RawMessageSet.Item)

_TESTMESSAGESETEXTENSION1.extensions_by_name['message_set_extension'].message_type = _TESTMESSAGESETEXTENSION1
google_dot_protobuf_dot_unittest__mset__wire__format__pb2.TestMessageSet.RegisterExtension(_TESTMESSAGESETEXTENSION1.extensions_by_name['message_set_extension'])
_TESTMESSAGESETEXTENSION2.extensions_by_name['message_set_extension'].message_type = _TESTMESSAGESETEXTENSION2
google_dot_protobuf_dot_unittest__mset__wire__format__pb2.TestMessageSet.RegisterExtension(_TESTMESSAGESETEXTENSION2.extensions_by_name['message_set_extension'])

DESCRIPTOR._options = None
_TESTMESSAGESETEXTENSION1.fields_by_name['test_aliasing']._options = None
# @@protoc_insertion_point(module_scope)
