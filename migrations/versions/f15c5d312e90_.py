"""empty message

Revision ID: f15c5d312e90
Revises: a7b2b9fd8ab3
Create Date: 2023-12-17 21:25:31.051948

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f15c5d312e90'
down_revision = 'a7b2b9fd8ab3'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('workouts', schema=None) as batch_op:
        batch_op.alter_column('created_by',
               existing_type=sa.INTEGER(),
               nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('workouts', schema=None) as batch_op:
        batch_op.alter_column('created_by',
               existing_type=sa.INTEGER(),
               nullable=False)

    # ### end Alembic commands ###
