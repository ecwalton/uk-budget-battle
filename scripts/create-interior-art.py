"""Original Blender props for the playable Budget screens."""
import bpy, math
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/assets/interiors';OUT.mkdir(exist_ok=True)
EDIT=ROOT/'assets/interiors';EDIT.mkdir(exist_ok=True)
def mat(name,c,metal=0):
 m=bpy.data.materials.new(name);m.diffuse_color=(*c,1);m.use_nodes=True;s=m.node_tree.nodes.get('Principled BSDF');s.inputs['Base Color'].default_value=(*c,1);s.inputs['Metallic'].default_value=metal;s.inputs['Roughness'].default_value=.45;return m
def box(name,loc,dims,m,rot=0):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=dims;o.rotation_euler.z=rot;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(m);mod=o.modifiers.new('Soft edges','BEVEL');mod.width=.035;mod.segments=3;o.modifiers.new('Normals','WEIGHTED_NORMAL');return o
def coin(x,y,z,r=.24):
 bpy.ops.mesh.primitive_cylinder_add(vertices=40,radius=r,depth=.075,location=(x,y,z));o=bpy.context.object;o.data.materials.append(gold);mod=o.modifiers.new('Milled edge','BEVEL');mod.width=.012;mod.segments=2
 for p in o.data.polygons:p.use_smooth=True
 return o
def text(body,loc,size,m,rot=0):
 c=bpy.data.curves.new(body,'FONT');c.body=body;c.align_x='CENTER';c.size=size;c.extrude=.002;c.resolution_u=3;o=bpy.data.objects.new(body,c);bpy.context.collection.objects.link(o);o.location=loc;o.rotation_euler.z=rot;c.materials.append(m)
def stack(x,y,n):
 for i in range(n):coin(x,y,.10+i*.085)
 text('£',(x,y,.145+(n-1)*.085),.25,ink)
def sheet(x,y,z,w=1.3,h=1.6,rot=0):return box('Paper',(x,y,z),(w,h,.035),paper,rot)
def house(x,y,h=1,color=None):
 box('Building',(x,y,h/2),(.63,.62,h),cream);box('Roof',(x,y,h+.06),(.76,.74,.15),color or red)
 for xx in [x-.18,x+.18]:
  for zz in [.3,h-.2]:box('Window',(xx,y-.322,zz),(.13,.025,.14),teal)
 box('Door',(x,y-.326,.15),(.12,.03,.28),ink)
for kind in ['spending','funding','income','vat','business','borrowing','legacy','news','energy','rates']:
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
 cream=mat('Warm stone',(.79,.72,.57));paper=mat('Ivory paper',(.93,.89,.78));red=mat('Treasury red',(.48,.045,.075));teal=mat('Treasury green',(.035,.30,.26));gold=mat('Brass',(.82,.50,.12),.62);ink=mat('Ink',(.025,.06,.09));coral=mat('Coral',(.82,.21,.11))
 if kind=='spending':
  box('Town plinth',(0,0,-.04),(2.75,1.8,.15),teal)
  house(-.87,.25,.9);house(0,.4,1.35);house(.9,.25,.75)
  box('Clinic',(-.72,-.55,.29),(.62,.43,.58),paper)
  box('Cross',(-.72,-.78,.35),(.08,.024,.25),red);box('Cross',(-.72,-.78,.35),(.25,.024,.08),red)
  box('Road',(.35,-.48,.055),(1.5,.28,.025),cream)
  for x in [-.13,.3,.73]:box('Road marking',(x,-.48,.075),(.18,.025,.01),paper)
 elif kind in ['funding','income']:
  box('Calculator',(0,0,.13),(1.15,1.55,.25),teal)
  box('Display',(0,.47,.27),(.86,.36,.035),ink);text('£',(0,.40,.30),.26,paper)
  for x in [-.32,0,.32]:
   for y in [-.5,-.19,.12]:box('Key',(x,y,.29),(.23,.22,.08),coral if x==.32 else paper)
  if kind=='funding':stack(.99,-.30,6);stack(.84,.36,3);sheet(-.9,.17,.05,.52,1.2,-.15)
  else:stack(.78,-.4,4)
 elif kind=='vat':
  box('Shopping bag',(0,0,.59),(1.22,.65,1.15),coral)
  for x in [-.32,.32]:box('Bag handle',(x,0,1.32),(.075,.1,.44),gold)
  box('Bag handle top',(0,0,1.54),(.69,.1,.08),gold);stack(.86,-.2,3)
 elif kind=='business':
  house(-.35,.1,1.35,teal);house(.43,.12,.86,red);stack(.66,-.6,4)
 elif kind=='borrowing':
  for i in range(4):sheet(0,0,.06+i*.055,1.35,1.7,.1)
  box('Bond ribbon',(0,0,.29),(.28,1.68,.04),red,.1)
  coin(.3,-.48,.33,.22);text('£',(.3,-.48,.38),.25,ink);stack(.93,.1,4)
 elif kind=='legacy':
  box('Closed ledger',(-.32,0,.15),(1.65,1.75,.29),teal)
  box('Pages',(-.27,-.03,.18),(1.49,1.68,.15),paper);box('Cover',(-.32,0,.31),(1.66,1.77,.065),teal)
  text('YOUR RECORD',(-.32,.2,.35),.14,paper);text('FIVE BUDGETS',(-.32,-.10,.35),.105,gold)
  box('Bookmark',(-.32,-.86,.34),(.23,.5,.03),red);stack(.86,-.36,5)
 elif kind=='news':
  for i in range(5):sheet(0,0,.035+i*.043,1.9,1.65,-.10)
  text('THE BUDGET',(0,.43,.24),.19,ink,-.10);text('BULLETIN',(0,.18,.24),.20,ink,-.10)
  box('Photo',(-.48,-.32,.244),(.66,.57,.018),teal,-.10)
  for i in range(5):box('Print rule',(.42,-.12-i*.11,.244),(.7,.02,.018),ink,-.10)
 elif kind=='energy':
  box('Power base',(0,0,.1),(1.5,.94,.2),teal)
  # A thick lightning bolt, cut as a polygon.
  coords=[(.08,1.7),(-.62,.78),(-.09,.78),(-.32,.18),(.65,1.12),(.12,1.12)]
  verts=[(x,y,z) for y in [-.12,.12] for x,z in coords];faces=[tuple(range(6)),tuple(range(6,12))]+[(i,(i+1)%6,(i+1)%6+6,i+6) for i in range(6)]
  mesh=bpy.data.meshes.new('Lightning');mesh.from_pydata(verts,[],faces);o=bpy.data.objects.new('Energy shock',mesh);bpy.context.collection.objects.link(o);o.data.materials.append(gold)
 elif kind=='rates':
  box('Rate chart',(0,0,.025),(1.7,1.05,.07),paper)
  for i,h in enumerate([.35,.65,1.1]):box('Rising yield',(-.55+i*.55,0,h/2+.06),(.34,.48,h),coral if i==2 else teal)
  stack(.72,-.66,3)
 scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=24;scene.render.resolution_x=512;scene.render.resolution_y=420;scene.render.resolution_percentage=100;scene.render.film_transparent=True;scene.world.color=(.7,.7,.7)
 for loc,power,size in [((-3,-4,6),650,4),((4,2,4),450,3)]:
  bpy.ops.object.light_add(type='AREA',location=loc);bpy.context.object.data.energy=power;bpy.context.object.data.size=size
 bpy.ops.object.camera_add(location=(3,-5,3.8));cam=bpy.context.object;cam.rotation_euler=(Vector((0,0,.6))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=3.5 if kind=='spending' else 2.8;scene.camera=cam
 scene.render.image_settings.file_format='PNG';scene.render.filepath=str(OUT/f'{kind}.png');bpy.ops.wm.save_as_mainfile(filepath=str(EDIT/f'{kind}.blend'));bpy.ops.render.render(write_still=True)
